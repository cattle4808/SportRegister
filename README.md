# SportRegister

Here's a README.md tailored for deploying this project on production using Gunicorn, optionally with Nginx:

# SportRegulate

A Django-based web application designed for sports regulation and management. This guide outlines the setup process for deploying the project in a production environment using Gunicorn and optionally Nginx.

---

## Table of Contents
1. [Project Structure](#project-structure)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Environment Variables](#environment-variables)
5. [Running with Gunicorn](#running-with-gunicorn)
6. [Optional: Setting Up Nginx](#optional-setting-up-nginx)

---

## Project Structure

The project has the following structure:

```plaintext
.
├── app
├── core
├── frontend
├── manage.py
└── requirements
Key components:

app: Core application logic including models, views, and serializers.
core: Project configurations (settings, URLs, WSGI, etc.).
frontend: Static files and templates.
manage.py: Entry point for Django commands.
requirements: Dependency files for different environments.
Prerequisites

Python 3.9 or higher
Django 4.0+
PostgreSQL (or another database, as configured in settings/production.py)
Gunicorn
(Optional) Nginx for reverse proxy
Installation

Clone the Repository
git clone <repository-url>
cd SportRegulate
Set Up Virtual Environment
python3 -m venv venv
source venv/bin/activate
Install Dependencies
pip install -r requirements/production.txt
Set Up the Database
Configure your database in core/settings/production.py.
Apply migrations:
python manage.py migrate
Collect Static Files
python manage.py collectstatic
Environment Variables

Create a .env file in the root directory with the following variables:

SECRET_KEY=<your-secret-key>
DEBUG=False
ALLOWED_HOSTS=<your-domain-or-ip>
DATABASE_URL=<database-url>
Running with Gunicorn

Start Gunicorn
gunicorn core.wsgi:application --bind 0.0.0.0:8000 --workers 3
Running Gunicorn as a System Service Create a systemd service file:
sudo nano /etc/systemd/system/sportregulate.service
Add the following content:

[Unit]
Description=Gunicorn for SportRegulate
After=network.target

[Service]
User=your-user
Group=www-data
WorkingDirectory=/path/to/SportRegulate
ExecStart=/path/to/venv/bin/gunicorn core.wsgi:application --bind 0.0.0.0:8000 --workers 3

[Install]
WantedBy=multi-user.target
Start and enable the service:

sudo systemctl start sportregulate
sudo systemctl enable sportregulate
Optional: Setting Up Nginx

Install Nginx
sudo apt update
sudo apt install nginx
Configure Nginx Create a configuration file:
sudo nano /etc/nginx/sites-available/sportregulate
Add the following content:

server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /static/ {
        alias /path/to/SportRegulate/static/;
    }
}
Enable the Configuration
sudo ln -s /etc/nginx/sites-available/sportregulate /etc/nginx/sites-enabled
sudo nginx -t
sudo systemctl restart nginx
Notes

Always keep your SECRET_KEY secure.
Use HTTPS for production by configuring an SSL certificate with Certbot or another tool.
Monitor server logs for errors:
sudo journalctl -u sportregulate
sudo tail -f /var/log/nginx/error.log
Conclusion

This guide helps deploy the SportRegulate project in production using Gunicorn and optionally Nginx. Adjust configurations based on your specific requirements.






