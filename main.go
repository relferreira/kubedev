package main

import (
	"bufio"
	"bytes"
	"flag"
	"io"
	"log"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gobuffalo/packr"
	"github.com/relferreira/sse"
	cors "github.com/rs/cors/wrapper/gin"
	v1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/tools/clientcmd"
)

func main() {
	r := gin.Default()
	var kubeconfig = flag.String("kubeconfig", filepath.Join(os.Getenv("HOME"), ".kube", "config"), "(optional) absolute path to the kubeconfig file")
	flag.Parse()
	config, err := clientcmd.BuildConfigFromFlags("", *kubeconfig)
	if err != nil {
		panic(err.Error())
	}

	clientset, err := kubernetes.NewForConfig(config)

	r.Use(cors.Default())

	box := packr.NewBox("./dist")
	r.StaticFS("/ui", box)

	r.GET("/api", func(c *gin.Context) {
		namespaces, err := clientset.CoreV1().Namespaces().List(metav1.ListOptions{})

		if err != nil {
			panic(err.Error())
		}

		c.JSON(200, namespaces)
	})

	r.GET("/api/:namespace/services", func(c *gin.Context) {
		namespace := c.Param("namespace")

		services, err := clientset.CoreV1().Services(namespace).List(metav1.ListOptions{})

		if err != nil {
			panic(err.Error())
		}

		c.JSON(200, services)
	})

	r.GET("/api/:namespace/deployments", func(c *gin.Context) {
		namespace := c.Param("namespace")

		deployments, err := clientset.AppsV1beta2().Deployments(namespace).List(metav1.ListOptions{})

		if err != nil {
			panic(err.Error())
		}

		c.JSON(200, deployments)
	})

	r.GET("/api/:namespace/pods", func(c *gin.Context) {
		namespace := c.Param("namespace")

		pods, err := clientset.CoreV1().Pods(namespace).List(metav1.ListOptions{})
		if err != nil {
			panic(err.Error())
		}

		c.JSON(200, pods)
	})

	r.GET("/api/:namespace/pods/:name", func(c *gin.Context) {
		namespace := c.Param("namespace")
		name := c.Param("name")

		pod, err := clientset.CoreV1().Pods(namespace).Get(name, metav1.GetOptions{})
		if err != nil {
			panic(err.Error())
		}

		c.JSON(200, pod)
	})

	r.GET("/api/:namespace/pods/:name/:container/logs", func(c *gin.Context) {
		namespace := c.Param("namespace")
		name := c.Param("name")
		logOptions := v1.PodLogOptions{}
		req := clientset.CoreV1().Pods(namespace).GetLogs(name, &logOptions)
		podLogs, err := req.Stream()
		if err != nil {
			panic(err.Error())
		}

		defer podLogs.Close()
		buf := new(bytes.Buffer)
		_, err = io.Copy(buf, podLogs)
		if err != nil {
			panic("error in copy information from podLogs to buf")
		}
		str := buf.String()
		c.JSON(200, gin.H{
			"log": str,
		})
	})

	r.GET("/api/:namespace/pods/:name/:container/logs/stream", func(c *gin.Context) {
		namespace := c.Param("namespace")
		name := c.Param("name")
		container := c.Param("container")
		logOptions := v1.PodLogOptions{
			Container: container,
			Follow:    true,
		}
		req := clientset.CoreV1().Pods(namespace).GetLogs(name, &logOptions)
		podLogs, err := req.Stream()
		if err != nil {
			panic(err.Error())
		}

		defer podLogs.Close()
		chanStream := make(chan string)
		go func() {
			defer close(chanStream)
			reader := bufio.NewReader(podLogs)
			for {
				line, _ := reader.ReadBytes('\n')
				log.Println(string(line))
				chanStream <- string(line)
			}
		}()
		c.Stream(func(w io.Writer) bool {
			if msg, ok := <-chanStream; ok {
				c.Render(-1, sse.Event{
					Data: map[string]interface{}{
						"date":    time.Now().Unix(),
						"content": msg,
					},
				})
				return true
			}
			return false
		})
	})

	r.Run() // listen and serve on 0.0.0.0:8080
}
