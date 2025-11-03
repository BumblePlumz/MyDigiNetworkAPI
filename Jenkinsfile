pipeline {
    agent {
        docker {
            image 'node:22.21.1-bookworm'
            args '-v /var/run/docker.sock:/var/run/docker.sock -v $WORKSPACE:/app -w /app'
        }
    }

    stages {
        stage('Checkout') {
            steps {
                echo '📥 Cloning repository...'
                checkout scmGit(branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[credentialsId: 'mydi-api-pipeline', url: 'https://github.com/BumblePlumz/MyDigiNetworkAPI.git']])
                echo '✅ Repository cloned successfully!'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '📦 Installing dependencies...'
                sh 'npm ci'
                echo '✅ Dependencies installed successfully!'
            }
        }

        stage('Run Tests') {
            steps {
                echo '🧪 Running unit tests...'
                sh 'npm run test:ci'
            }
            post {
                always {
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'coverage',
                        reportFiles: 'index.html',
                        reportName: 'Coverage Report'
                    ])
                }
                success {
                    echo '✅ Tests passed successfully!'
                }
                failure {
                    echo '❌ Tests failed!'
                }
            }
        }
    }
}
