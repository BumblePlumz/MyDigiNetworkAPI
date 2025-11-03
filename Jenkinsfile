pipeline {
    agent any

    stages {
        stage("Checkout") {
            steps {
                echo "Cloning repository..."
                checkout scmGit(
                    branches: [[name: '*/main']],
                    extensions: [],
                    userRemoteConfigs: [[
                        credentialsId: 'efabefe9-b7dd-477c-afec-b748dd7e60a5',
                        url: 'https://github.com/BumblePlumz/MyDigiNetworkAPI'
                    ]]
                )
            }
        }

        stage("Install Dependencies") {
            steps {
                echo "Installing dependencies..."
                nodejs('nodejs') {
                    sh 'npm install'
                }
            }
        }

        stage("Run Tests") {
            steps {
                echo "Running unit tests..."
                nodejs('nodejs') {
                    sh 'npm run test:ci'
                }
            }
            post {
                always {
                    // Publier les rapports de couverture
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
                    echo "Tests passed successfully!"
                }
                failure {
                    echo "Tests failed!"
                }
            }
        }

        stage("Deploy") {
            when {
                branch 'main'
            }
            steps {
                echo "Deploying application..."
                nodejs('nodejs') {
                    sh 'npm run deploy'
                }
            }
        }
    }

    post {
        always {
            echo "Pipeline completed."
        }
        failure {
            echo "Pipeline failed."
        }
        success {
            echo "Pipeline succeeded."
        }
    }
}
