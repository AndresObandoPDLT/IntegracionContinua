pipeline {
    agent any

    triggers {
        pollSCM('H/5 * * * *')
    }

    environment {
        DOCKER_HOST = "unix:///var/run/docker.sock"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/AndresObandoPDLT/IntegracionContinua.git',
                    credentialsId: 'github-token'
            }
        }

        stage('Build Images') {
            steps {
                sh 'docker-compose build'
            }
        }

        stage('Startup for Tests') {
            steps {
                sh 'docker-compose up -d'
            }
        }

        stage('Run Backend Tests') {
            steps {
                sh 'docker exec express-backend npm test'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Desplegando aplicación en entorno local...'
                sh 'docker-compose up -d --build'
            }
        }

        stage('Finish') {
            steps {
                echo 'CI/CD completo: aplicación desplegada automáticamente.'
            }
        }
    }
}
