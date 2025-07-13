# Create a new Google Cloud project.
resource "google_project" "dev_firebase" {
  provider = google-beta.no_user_project_override

  name            = "DEV Curated"
  project_id      = "dev-${random_id.project_id_suffix.hex}"

  # Required for the project to display in any list of Firebase projects.
  labels = {
    "firebase" = "enabled"
  }
}

resource "random_id" "project_id_suffix" {
  byte_length = 8
}

# Enable the required underlying Service Usage API.
resource "google_project_service" "serviceusage" {
  provider = google-beta.no_user_project_override

  project = google_project.dev_firebase.project_id
  service = "serviceusage.googleapis.com"

  # Don't disable the service if the resource block is removed by accident.
  disable_on_destroy = false
}

# Enable the required underlying Firebase Management API.
resource "google_project_service" "firebase" {
  provider = google-beta.no_user_project_override

  project = google_project.dev_firebase.project_id
  service = "firebase.googleapis.com"

  # Don't disable the service if the resource block is removed by accident.
  disable_on_destroy = false
}

# Enable Firebase services for the new project created above.
resource "google_firebase_project" "dev_firebase" {
  provider = google-beta

  project = google_project.dev_firebase.project_id

  # Wait until the required APIs are enabled.
  depends_on = [
    google_project_service.firebase,
    google_project_service.serviceusage,
  ]
}

# Create a Firebase Web App in the new project created above.
resource "google_firebase_web_app" "dev" {
  provider = google-beta

  project      = google_firebase_project.dev_firebase.project
  display_name = "Curated"
  deletion_policy = "DELETE"
}
