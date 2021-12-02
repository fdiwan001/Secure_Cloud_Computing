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
  default     = "gcr.io/cloud-production-5be1a/secure_app:latest"
}
variable "domain" {
  description = "Zone domain."
  default     = "securecloudapp.org"
}