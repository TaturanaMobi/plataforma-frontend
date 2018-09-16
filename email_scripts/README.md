Worker v1

> There we have python scripts that connect in mongo and run some tasks.

## Install

```pip install -r "requirements.txt"```

## Configuration

We must create a file named ```taturana.conf``` and configure mongodb server and smtp server authentication details.

## Build Docker Image

```
docker build -t taturanamobi/worker-v1 .
docker push taturanamobi/worker-v1:latest
```

## Running with Docker

```
docker run -v "taturana.conf:/taturana.conf" -e "TATURANA_CONF_FILE=/taturana.conf" taturanamobi/worker-v1 python ./confirm_scheduling.py

docker run -v "taturana.conf:/taturana.conf" -e "TATURANA_CONF_FILE=/taturana.conf" taturanamobi/worker-v1 python ./confirm_scheduling_less_than_10_days.py

docker run -v "taturana.conf:/taturana.conf" -e "TATURANA_CONF_FILE=/taturana.conf" taturanamobi/worker-v1 python ./confirm_screening_date.py

docker run -v "taturana.conf:/taturana.conf" -e "TATURANA_CONF_FILE=/taturana.conf" taturanamobi/worker-v1 python ./send_the_movie_10_days.py

docker run -v "taturana.conf:/taturana.conf" -e "TATURANA_CONF_FILE=/taturana.conf" taturanamobi/worker-v1 python ./send_the_movie_9_days.py

docker run -v "taturana.conf:/taturana.conf" -e "TATURANA_CONF_FILE=/taturana.conf" taturanamobi/worker-v1 python ./send_the_movie_3_days.py

docker run -v "taturana.conf:/taturana.conf" -e "TATURANA_CONF_FILE=/taturana.conf" taturanamobi/worker-v1 python ./ask_for_report.py

docker run -v "taturana.conf:/taturana.conf" -e "TATURANA_CONF_FILE=/taturana.conf" taturanamobi/worker-v1 python ./ask_for_report_take_2.py

```
