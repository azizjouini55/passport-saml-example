FROM python:3.9-slim-buster

WORKDIR /app

COPY . /app


RUN pip install --trusted-host pypi.python.org -r requirements.txt

EXPOSE 8081

ENV NAME World

CMD ["python", "app.py"]