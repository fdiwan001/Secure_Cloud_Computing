variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "name" {
  description = "name prefix for resources"
  type        = string
}

variable "image" {
  description = "container image to deploy"
  default     = "gcr.io/cloud-development-e159d/github.com/fdiwan001/secure_cloud_computing@sha256:47a39200750f96030827aa717c1fae7fafad53148ddd1c0d9c81beba736750cd"
}
