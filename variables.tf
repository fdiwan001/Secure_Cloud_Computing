variable "project_id" {
  description = "GCP Project ID"
  type        = "cloud-development-e159d"
}

variable "name" {
  description = "name prefix for resources"
  type        = "secure-cloudrun-app"
}

variable "image" {
  description = "container image to deploy"
  default     = "gcr.io/cloud-development-e159d/github.com/fdiwan001/secure_cloud_computing:latest"
}
