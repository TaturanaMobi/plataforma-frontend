FROM python:2-alpine
WORKDIR /usr/src/app/email_scripts
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .