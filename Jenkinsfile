pipeline {
  agent any
  environment {
    CI = 'true'
    NODEJS_HOME = '${tool "Node"}'
    PATH='${env.NODEJS_HOME}/bin:${env.PATH}'
    WEBHOOK_URL = credentials('BOOKDINOSAUR_DISCORD_WEBHOOK_URL')
  }
  options {
    timeout(time: 3, unit: 'MINUTES') 
  }
  stages {
    stage('SCM') {
      steps {
        checkout scm
      }
    }
    stage('Build') {
      agent {
        docker {
          image 'node:lts-alpine'
          args '-p 3000:3000 -p 5000:5000'
        }
      }
      steps {
        sh 'npm install'
        sh 'cd client && npm install'
      }
    }
    stage('Test') {
      agent {
        docker {
          image 'node:lts-alpine'
          args '-p 3000:3000 -p 5000:5000'
        }
      }
      steps {
        sh 'npm test'
      }
    }
    stage('SonarQube scan') {
      steps {
        script {
          def SCANNER_HOME = tool name: 'SonarScanner', type: 'hudson.plugins.sonar.SonarRunnerInstallation';
          withSonarQubeEnv() {
            sh '${SCANNER_HOME}/bin/sonar-scanner'
          }
        }
      }
    }
    stage('Deliver for development') {
      agent {
        docker {
          image 'node:lts-alpine'
          args '-p 3000:3000 -p 5000:5000'
        }
      }
      steps {
        sh 'npm run dev'
      }
    }
  }
  post {
    success {
      discordSend title: 'Development 빌드 성공',
        link: env.BUILD_URL,
        result: currentBuild.currentResult,
        webhookURL: 'env.WEBHOOK_URL'
    }
    failure {
      discordSend title: 'Development 빌드 실패',
        link: env.BUILD_URL,
        result: currentBuild.currentResult,
        webhookURL: 'env.WEBHOOK_URL'
    }
  }
}
