```markdown
# Deploy SportRegulate for Production

## Steps to Deploy

1. **Clone the Repository**  
   Replace `<repository-url>` with your Git repository URL.
   ```bash
   git clone https://github.com/username/SportRegulate.git
   cd SportRegulate
   ```

2. **Set Up a Virtual Environment**  
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install Dependencies**  
   ```bash
   pip install -r requirements/production.txt
   ```

4. **Configure Environment Variables**  
   Replace placeholders (`<...>`) with your actual values.
   ```bash
   echo "SECRET_KEY=your-secret-key" >> .env
   echo "DEBUG=False" >> .env
   echo "ALLOWED_HOSTS=your-domain.com" >> .env
   echo "DATABASE_URL=postgres://user:password@localhost:5432/database_name" >> .env
   ```

5. **Apply Migrations and Collect Static Files**  
   ```bash
   python manage.py migrate
   python manage.py collectstatic --noinput
   ```

6. **Start Gunicorn**  
   ```bash
   gunicorn core.wsgi:application --bind 0.0.0.0:8000 --workers 3
   ```

7. **Run Gunicorn as a Systemd Service**  
   Replace `/path/to` with the actual paths on your system.
   ```bash
   sudo bash -c 'cat > /etc/systemd/system/sportregulate.service <<EOL
   [Unit]
   Description=Gunicorn for SportRegulate
   After=network.target

   [Service]
   User=$(whoami)
   Group=www-data
   WorkingDirectory=$(pwd)
   ExecStart=$(pwd)/venv/bin/gunicorn core.wsgi:application --bind 0.0.0.0:8000 --workers 3

   [Install]
   WantedBy=multi-user.target
   EOL'
   sudo systemctl start sportregulate
   sudo systemctl enable sportregulate
   ```

8. **Set Up Nginx as a Reverse Proxy**  
   Replace `<your-domain.com>` and `/path/to` with your actual values.
   ```bash
   sudo apt update && sudo apt install nginx -y
   sudo bash -c 'cat > /etc/nginx/sites-available/sportregulate <<EOL
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://127.0.0.1:8000;
           proxy_set_header Host \$host;
           proxy_set_header X-Real-IP \$remote_addr;
           proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
       }

       location /static/ {
           alias /path/to/SportRegulate/static/;
       }
   }
   EOL'
   sudo ln -s /etc/nginx/sites-available/sportregulate /etc/nginx/sites-enabled
   sudo nginx -t
   sudo systemctl restart nginx
   ```

9. **Logs and Debugging**  
   Gunicorn logs:
   ```bash
   sudo journalctl -u sportregulate
   ```
   Nginx logs:
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```
```
