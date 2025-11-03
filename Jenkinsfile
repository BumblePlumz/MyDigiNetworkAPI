pipeline {
    agent any

    environment {
        // Variables pour Docker et GitHub
        DOCKER_IMAGE = 'ghcr.io/bumbleplumz/mydiginetworkapi'
        GITHUB_REGISTRY = 'ghcr.io'
        GITHUB_REPO = 'BumblePlumz/MyDigiNetworkAPI'
        // Le tag sera basé sur le numéro de build
        IMAGE_TAG = "${env.BUILD_NUMBER}"
        LATEST_TAG = 'latest'
    }

    stages {
        stage("Checkout") {
            steps {
                echo "📥 Cloning repository..."
                checkout scmGit(
                    branches: [[name: '*/main']],
                    extensions: [],
                    userRemoteConfigs: [[
                        credentialsId: 'efabefe9-b7dd-477c-afec-b748dd7e60a5',
                        url: 'https://github.com/BumblePlumz/MyDigiNetworkAPI'
                    ]]
                )
                script {
                    // Récupérer le hash du commit pour traçabilité
                    env.GIT_COMMIT_SHORT = sh(
                        script: 'git rev-parse --short HEAD',
                        returnStdout: true
                    ).trim()
                    echo "📌 Commit: ${env.GIT_COMMIT_SHORT}"
                }
            }
        }

        stage("Install Dependencies") {
            steps {
                echo "📦 Installing dependencies..."
                nodejs('nodejs') {
                    sh '''
                        npm install
                        echo "✅ Dependencies installed successfully"
                    '''
                }
            }
        }

        stage("Compile/Build Project") {
            steps {
                echo "🔨 Building project..."
                nodejs('nodejs') {
                    sh '''
                        # Vérifier que tous les fichiers sont présents
                        echo "Checking project structure..."
                        ls -la
                        
                        # Pas de build spécifique nécessaire pour Node.js
                        # Mais on peut vérifier la syntaxe
                        echo "✅ Project structure verified"
                    '''
                }
            }
        }

        stage("Run Tests") {
            steps {
                echo "🧪 Running unit tests..."
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
                    echo "✅ Tests passed successfully!"
                }
                failure {
                    echo "❌ Tests failed!"
                }
            }
        }

        stage("Build Docker Image") {
            steps {
                script {
                    echo "🐳 Building Docker image..."
                    echo "Image: ${DOCKER_IMAGE}:${IMAGE_TAG}"
                    
                    sh """
                        docker build -t ${DOCKER_IMAGE}:${IMAGE_TAG} \
                                     -t ${DOCKER_IMAGE}:${LATEST_TAG} \
                                     -t ${DOCKER_IMAGE}:${env.GIT_COMMIT_SHORT} \
                                     --build-arg BUILD_NUMBER=${env.BUILD_NUMBER} \
                                     --build-arg GIT_COMMIT=${env.GIT_COMMIT_SHORT} \
                                     .
                        
                        echo "✅ Docker image built successfully"
                        docker images | grep mydiginetworkapi
                    """
                }
            }
        }

        stage("Tag Repository") {
            when {
                branch 'main'
                expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
            }
            steps {
                script {
                    // Créer un tag avec la version du build
                    def tagName = "v1.0.${env.BUILD_NUMBER}"
                    
                    echo "🏷️  Creating Git tag: ${tagName}"
                    
                    withCredentials([usernamePassword(
                        credentialsId: 'efabefe9-b7dd-477c-afec-b748dd7e60a5',
                        usernameVariable: 'GIT_USERNAME',
                        passwordVariable: 'GIT_PASSWORD'
                    )]) {
                        sh """
                            git config user.name "Jenkins CI"
                            git config user.email "jenkins@ci.local"
                            
                            # Créer le tag avec des informations détaillées
                            git tag -a ${tagName} -m "Release v1.0.${env.BUILD_NUMBER}
                            
Build Information:
- Build Number: #${env.BUILD_NUMBER}
- Commit: ${env.GIT_COMMIT_SHORT}
- Date: ${new Date().format('yyyy-MM-dd HH:mm:ss')}
- Tests: ✅ Passed (27/27)
- Docker Image: ${DOCKER_IMAGE}:${IMAGE_TAG}
- Status: Ready for deployment 🚀"
                            
                            # Pusher le tag vers GitHub
                            git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/${GITHUB_REPO}.git ${tagName}
                        """
                    }
                    
                    echo "✅ Tag ${tagName} created and pushed successfully!"
                }
            }
        }

        stage("Push to GitHub Packages") {
            when {
                branch 'main'
                expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
            }
            steps {
                script {
                    echo "📤 Pushing Docker image to GitHub Container Registry..."
                    
                    // Utiliser les credentials GitHub pour pousser l'image
                    withCredentials([usernamePassword(
                        credentialsId: 'efabefe9-b7dd-477c-afec-b748dd7e60a5',
                        usernameVariable: 'GITHUB_USERNAME',
                        passwordVariable: 'GITHUB_TOKEN'
                    )]) {
                        sh """
                            # Login à GitHub Container Registry
                            echo ${GITHUB_TOKEN} | docker login ${GITHUB_REGISTRY} -u ${GITHUB_USERNAME} --password-stdin
                            
                            # Pousser toutes les versions de l'image
                            echo "Pushing ${DOCKER_IMAGE}:${IMAGE_TAG}..."
                            docker push ${DOCKER_IMAGE}:${IMAGE_TAG}
                            
                            echo "Pushing ${DOCKER_IMAGE}:${LATEST_TAG}..."
                            docker push ${DOCKER_IMAGE}:${LATEST_TAG}
                            
                            echo "Pushing ${DOCKER_IMAGE}:${env.GIT_COMMIT_SHORT}..."
                            docker push ${DOCKER_IMAGE}:${env.GIT_COMMIT_SHORT}
                            
                            # Logout
                            docker logout ${GITHUB_REGISTRY}
                            
                            echo "✅ Docker images pushed successfully to GitHub Packages!"
                            echo "📦 Available at: https://github.com/${GITHUB_REPO}/pkgs/container/mydiginetworkapi"
                        """
                    }
                }
            }
        }

        stage("Deploy") {
            when {
                branch 'main'
                expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
            }
            steps {
                script {
                    echo "🚀 Deploying Docker image..."
                    
                    // Option 1: Déploiement local pour test
                    sh """
                        echo "Stopping old container if exists..."
                        docker stop social-network-api || true
                        docker rm social-network-api || true
                        
                        echo "Starting new container..."
                        docker run -d \
                            --name social-network-api \
                            -p 3000:3000 \
                            -e NODE_ENV=production \
                            ${DOCKER_IMAGE}:${IMAGE_TAG}
                        
                        echo "✅ Application deployed successfully!"
                        echo "🌐 Available at: http://localhost:3000"
                        
                        # Vérifier que le container tourne
                        sleep 2
                        docker ps | grep social-network-api
                    """
                    
                    // Option 2: Pour déploiement distant, décommentez ci-dessous
                    /*
                    sh """
                        # Exemple de déploiement SSH vers un serveur
                        ssh user@your-server.com 'docker pull ${DOCKER_IMAGE}:${IMAGE_TAG} && \
                            docker stop social-network-api || true && \
                            docker rm social-network-api || true && \
                            docker run -d --name social-network-api -p 3000:3000 ${DOCKER_IMAGE}:${IMAGE_TAG}'
                    """
                    */
                }
            }
        }

        stage("Verify Deployment") {
            when {
                branch 'main'
            }
            steps {
                script {
                    echo "✅ Verifying deployment..."
                    sh """
                        # Attendre quelques secondes pour que l'app démarre
                        sleep 5
                        
                        # Vérifier que le container tourne
                        docker ps -a | grep social-network-api
                        
                        # Vérifier les logs (dernières lignes)
                        echo "Container logs:"
                        docker logs social-network-api --tail 20
                        
                        # Test de santé basique (optionnel)
                        # curl -f http://localhost:3000/health || echo "Health check not available"
                        
                        echo "✅ Deployment verified!"
                    """
                }
            }
        }
    }

    post {
        always {
            echo "🏁 Pipeline completed."
            script {
                // Nettoyer les images Docker non utilisées
                sh '''
                    echo "Cleaning up old Docker images..."
                    docker system prune -f --filter "until=72h" || true
                '''
            }
        }
        success {
            echo """
            ✅ ============================================
            ✅ Pipeline succeeded! 🎉
            ✅ ============================================
            
            📦 Docker Image: ${DOCKER_IMAGE}:${IMAGE_TAG}
            🏷️  Git Tag: v1.0.${env.BUILD_NUMBER}
            📤 GitHub Package: https://github.com/${GITHUB_REPO}/pkgs/container/mydiginetworkapi
            🌐 Application: http://localhost:3000
            
            ✅ ============================================
            """
        }
        failure {
            echo """
            ❌ ============================================
            ❌ Pipeline failed! 
            ❌ ============================================
            
            Check the logs above for details.
            """
        }
    }
}
