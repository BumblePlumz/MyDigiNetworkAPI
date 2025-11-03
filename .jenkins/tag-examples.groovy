// EXEMPLES DE STRATEGIES DE TAGGING POUR JENKINS

// ============================================
// Option 1 : Tag avec numéro de build et date
// ============================================
stage("Create Tag - Build Number") {
    steps {
        script {
            def tagName = "build-${env.BUILD_NUMBER}-${new Date().format('yyyyMMdd-HHmmss')}"
            // Exemple: build-42-20251103-143025
            
            sh """
                git tag -a ${tagName} -m "Build #${env.BUILD_NUMBER}"
                git push origin ${tagName}
            """
        }
    }
}

// ============================================
// Option 2 : Tag sémantique (version)
// ============================================
stage("Create Tag - Semantic Version") {
    steps {
        script {
            // Lire la version depuis package.json
            def packageJson = readJSON file: 'package.json'
            def version = packageJson.version
            def tagName = "v${version}-build.${env.BUILD_NUMBER}"
            // Exemple: v1.0.0-build.42
            
            sh """
                git tag -a ${tagName} -m "Release ${version} (Build #${env.BUILD_NUMBER})"
                git push origin ${tagName}
            """
        }
    }
}

// ============================================
// Option 3 : Tag simple avec environnement
// ============================================
stage("Create Tag - Environment") {
    steps {
        script {
            def environment = env.BRANCH_NAME == 'main' ? 'production' : 'staging'
            def tagName = "${environment}-${new Date().format('yyyyMMdd')}-${env.BUILD_NUMBER}"
            // Exemple: production-20251103-42
            
            sh """
                git tag -a ${tagName} -m "Deploy to ${environment}"
                git push origin ${tagName}
            """
        }
    }
}

// ============================================
// Option 4 : Tag uniquement sur release
// ============================================
stage("Create Release Tag") {
    when {
        branch 'main'
        expression { 
            // Vérifier si le commit contient [release]
            return sh(
                script: 'git log -1 --pretty=%B',
                returnStdout: true
            ).contains('[release]')
        }
    }
    steps {
        script {
            def packageJson = readJSON file: 'package.json'
            def tagName = "v${packageJson.version}"
            // Exemple: v1.0.0
            
            sh """
                git tag -a ${tagName} -m "Release ${packageJson.version} ✅"
                git push origin ${tagName}
            """
        }
    }
}

// ============================================
// Option 5 : Tag avec informations détaillées
// ============================================
stage("Create Detailed Tag") {
    steps {
        script {
            def tagName = "release-${new Date().format('yyyy.MM.dd')}.${env.BUILD_NUMBER}"
            def commitHash = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
            def author = sh(script: 'git log -1 --pretty=%an', returnStdout: true).trim()
            
            def message = """
Release Information:
- Build: #${env.BUILD_NUMBER}
- Date: ${new Date().format('yyyy-MM-dd HH:mm:ss')}
- Commit: ${commitHash}
- Author: ${author}
- Tests: ✅ Passed
            """.trim()
            
            sh """
                git tag -a ${tagName} -m "${message}"
                git push origin ${tagName}
            """
        }
    }
}

// ============================================
// Option 6 : Tag conditionnel (tests passés)
// ============================================
stage("Create Tag If Tests Pass") {
    when {
        expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
    }
    steps {
        script {
            def tagName = "tested-${env.BUILD_NUMBER}"
            
            sh """
                git tag -a ${tagName} -m "Build #${env.BUILD_NUMBER} - All tests passed ✅"
                git push origin ${tagName}
            """
        }
    }
}

// ============================================
// Option 7 : Tag avec coverage
// ============================================
stage("Create Tag With Coverage") {
    steps {
        script {
            // Lire le pourcentage de couverture (exemple simplifié)
            def tagName = "build-${env.BUILD_NUMBER}-coverage-ok"
            
            sh """
                git tag -a ${tagName} -m "Build #${env.BUILD_NUMBER} - Coverage: >80% ✅"
                git push origin ${tagName}
            """
        }
    }
}

// ============================================
// Option 8 : Tag avec credentialsId
// ============================================
stage("Create Tag With Credentials") {
    steps {
        script {
            def tagName = "build-${env.BUILD_NUMBER}"
            
            withCredentials([usernamePassword(
                credentialsId: 'your-credential-id',
                usernameVariable: 'GIT_USERNAME',
                passwordVariable: 'GIT_PASSWORD'
            )]) {
                sh """
                    git config user.name "Jenkins CI"
                    git config user.email "jenkins@ci.local"
                    git tag -a ${tagName} -m "Automated tag by Jenkins"
                    git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/user/repo.git ${tagName}
                """
            }
        }
    }
}

// ============================================
// UTILISATION DANS VOTRE JENKINSFILE
// ============================================

/*
Copiez l'une de ces options dans votre Jenkinsfile,
généralement après l'étape de tests et avant le déploiement :

pipeline {
    agent any
    
    stages {
        stage("Tests") {
            // ...
        }
        
        // AJOUTEZ ICI UNE DES OPTIONS CI-DESSUS
        
        stage("Deploy") {
            // ...
        }
    }
}
*/

// ============================================
// COMMANDES GIT UTILES
// ============================================

/*
# Lister tous les tags
git tag -l

# Voir les détails d'un tag
git show tag-name

# Supprimer un tag local
git tag -d tag-name

# Supprimer un tag distant
git push origin --delete tag-name

# Récupérer tous les tags
git fetch --tags

# Checkout sur un tag spécifique
git checkout tags/tag-name
*/
