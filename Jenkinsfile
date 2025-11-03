pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'ghcr.io/bumbleplumz/mydiginetworkapi'
        GITHUB_REGISTRY = 'ghcr.io'
        GITHUB_REPO = 'BumblePlumz/MyDigiNetworkAPI'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
        LATEST_TAG = 'latest'
    }

    stages {
        stage('Checkout') {
            steps {
                echo '📥 Cloning repository...'
                checkout scmGit(branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[credentialsId: 'mydi-api-pipeline', url: 'https://github.com/BumblePlumz/MyDigiNetworkAPI.git']])
                echo '✅ Repository cloned successfully!'
            }
        }

        stage('Build Dependencies') {
            agent {
                docker {
                    image 'node:22.11.0-bookworm-slim'
                    args '-v $WORKSPACE:/app -w /app'
                    reuseNode true
                }
            }
            steps {
                echo '📦 Installing dependencies...'
                sh 'npm ci'
                echo '✅ Dependencies installed successfully!'
            }
        }

        stage('Run Tests') {
            agent {
                docker {
                    image 'node:22.11.0-bookworm-slim'
                    args '-v $WORKSPACE:/app -w /app'
                    reuseNode true
                }
            }
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

        stage('Build Docker Image') {
            steps {
                script {
                    echo '🐳 Building Docker image...'
                    echo "Image: ${DOCKER_IMAGE}:${IMAGE_TAG}"
                    
                    sh 'docker --version'

                    sh """
                        docker build -t ${DOCKER_IMAGE}:${IMAGE_TAG} \
                                     -t ${DOCKER_IMAGE}:${LATEST_TAG} \
                                     -t ${DOCKER_IMAGE}:${env.GIT_COMMIT[0..6]} \
                                     --build-arg BUILD_NUMBER=${env.BUILD_NUMBER} \
                                     --build-arg GIT_COMMIT=${env.GIT_COMMIT[0..6]} \
                                     .

                        echo "✅ Docker image built successfully"
                        docker images | grep mydiginetworkapi
                    """
                }
            }
        }
        
        stage("Tag Repository") {
            steps {
                script {
                    def tagName = "v1.0.${env.BUILD_NUMBER}"
                    
                    echo "🏷️  Creating Git tag: ${tagName}"
                    
                    withCredentials([gitUsernamePassword(credentialsId: 'bumble-jenkins-token', gitToolName: 'Default')]) {
                        sh """
                            git config user.name "Jenkins CI"
                            git config user.email "jenkins@ci.local"
                            
                            git tag -a ${tagName} -m "Release v1.0.${env.BUILD_NUMBER}
                            
                            Build Information:
                            - Build Number: #${env.BUILD_NUMBER}
                            - Commit: ${env.GIT_COMMIT[0..6]}
                            - Date: \$(date '+%Y-%m-%d %H:%M:%S')
                            - Tests: ✅ Passed
                            - Docker Image: ${DOCKER_IMAGE}:${IMAGE_TAG}
                            - Status: Ready for deployment 🚀"
                            
                            git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/${GITHUB_REPO}.git ${tagName}
                        """
                    }
                    
                    echo "✅ Tag ${tagName} created and pushed successfully!"
                }
            }
        }

        stage("Push to GitHub Packages") {
            steps {
                script {
                    echo "📤 Pushing Docker image to GitHub Container Registry..."
                    
                    withCredentials([gitUsernamePassword(credentialsId: 'bumble-jenkins-token', gitToolName: 'Default')]) { 
                        sh """
                            echo ${GITHUB_TOKEN} | docker login ${GITHUB_REGISTRY} -u ${GITHUB_USERNAME} --password-stdin
                            
                            echo "Pushing ${DOCKER_IMAGE}:${IMAGE_TAG}..."
                            docker push ${DOCKER_IMAGE}:${IMAGE_TAG}
                            
                            echo "Pushing ${DOCKER_IMAGE}:${LATEST_TAG}..."
                            docker push ${DOCKER_IMAGE}:${LATEST_TAG}
                            
                            echo "Pushing ${DOCKER_IMAGE}:${env.GIT_COMMIT[0..6]}..."
                            docker push ${DOCKER_IMAGE}:${env.GIT_COMMIT[0..6]}
                            
                            docker logout ${GITHUB_REGISTRY}
                            
                            echo "✅ Docker images pushed successfully to GitHub Packages!"
                            echo "📦 Available at: https://github.com/${GITHUB_REPO}/pkgs/container/mydiginetworkapi"
                        """
                    }
                }
            }
        }
    }
}
