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
  default     = "gcr.io/cloud-development-e159d/github.com/fdiwan001/secure_cloud_computing@sha256:97e05cfde4ff05dc74fa38bc6e63e59425809662a4a64d0053370fa841b61780"
}
