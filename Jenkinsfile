pipeline {
    agent {
        docker {
            image 'node:22.21.1-bookworm'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }

    stages {
        stage("Checkout") {
            steps {
                echo "📥 Cloning repository..."
                checkout scmGit(branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[credentialsId: 'mydi-api-pipeline', url: 'https://github.com/BumblePlumz/MyDigiNetworkAPI.git']])
                echo "✅ Repository cloned successfully!"
            }
        }

        stage("Install Dependencies") {
            steps {
                echo "📦 Installing dependencies..."
                sh 'npm ci'
                echo "✅ Dependencies installed successfully!"
            }
        }


    }
}