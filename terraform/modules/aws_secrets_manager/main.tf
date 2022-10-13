resource "aws_secretsmanager_secret" "admin_backend" {
  name                    = "admin-backend/production"
  recovery_window_in_days = 0

  lifecycle {
    prevent_destroy = false
  }
}

data "aws_secretsmanager_secret_version" "current" {
  secret_id = aws_secretsmanager_secret.admin_backend.id
}

output "aws_secret_manager_id" {
  value = data.aws_secretsmanager_secret_version.current.secret_id
}
