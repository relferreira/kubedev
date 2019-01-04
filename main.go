package main

import (
	"flag"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
	cors "github.com/rs/cors/wrapper/gin"
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
	r.GET("/deploy", func(c *gin.Context) {
		namespace := getNamespaceQueryParam(c)

		deployments, err := clientset.AppsV1beta2().Deployments(namespace).List(metav1.ListOptions{})

		if err != nil {
			panic(err.Error())
		}

		c.JSON(200, deployments)
	})

	r.GET("/pods", func(c *gin.Context) {
		namespace := getNamespaceQueryParam(c)

		pods, err := clientset.CoreV1().Pods(namespace).List(metav1.ListOptions{})
		if err != nil {
			panic(err.Error())
		}

		c.JSON(200, pods)
	})

	// corsConfig := cors.DefaultConfig()
	// corsConfig.AllowOrigins = []string{"http://localhost:1234"}
	// r.Use(cors.New(corsConfig))

	r.Run() // listen and serve on 0.0.0.0:8080
}

func getNamespaceQueryParam(c *gin.Context) string {
	namespace, exists := c.GetQuery("namespace")
	if !exists {
		panic("Namespace is required")
	}

	return namespace
}
