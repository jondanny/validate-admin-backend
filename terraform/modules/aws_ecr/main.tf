resource "aws_ecr_repository" "admin_backend" {
  name                 = "admin_backend"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}
