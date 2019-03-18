package models

import (
	"k8s.io/api/apps/v1beta2"
	v1 "k8s.io/api/core/v1"
)

//DeploymentResponse details
type DeploymentResponse struct {
	Deployment *v1beta2.Deployment `json:"deployment"`
	Pods       *v1.PodList         `json:"pods"`
}
