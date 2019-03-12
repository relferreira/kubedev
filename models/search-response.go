package models

import (
	"k8s.io/api/apps/v1beta2"
	batchV1 "k8s.io/api/batch/v1"
	"k8s.io/api/batch/v1beta1"
	v1 "k8s.io/api/core/v1"
)

//SearchResponse details
type SearchResponse struct {
	Services    *v1.ServiceList         `json:"services"`
	Deployments *v1beta2.DeploymentList `json:"deployments"`
	Pods        *v1.PodList             `json:"pods"`
	CronJobs    *v1beta1.CronJobList    `json:"cron-jobs"`
	Jobs        *batchV1.JobList        `json:"jobs"`
}
