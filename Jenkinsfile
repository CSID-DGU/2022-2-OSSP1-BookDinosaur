pipeline {
  agent {
    docker {
      image 'node:lts-alpine'
      args '-p 3000:3000 -p 5000:5000'
    }
  }
  environment {
    CI = 'true'
    NODEJS_HOME = '${tool "Node"}'
    PATH='${env.NODEJS_HOME}/bin:${env.PATH}'
    WEBHOOK_URL = credentials('BOOKDINOSAUR_DISCORD_WEBHOOK_URL')
  }
  stages {
    stage('SCM') {
      steps {
        checkout scm
      }
    }
    stage('Build') {
      steps {
        sh 'npm install'
        sh 'cd client && npm install'
      }
    }
    stage('Test') {
      steps {
        sh 'npm test'
      }
    }
    stage('SonarQube scan') {
      when {
        beforeAgent true
        branch 'jenkins-pipeline'
      }
      environment {
          SCANNER_HOME = tool name: 'SonarScanner', type: 'hudson.plugins.sonar.SonarRunnerInstallation';
      }
      steps {
        withSonarQubeEnv(installationName: 'SonarQube') {
          sh '${SCANNER_HOME}/bin/sonar-scanner'
        }
      }
    }
    stage('Deliver for development') {
      when {
        beforeAgent true
        branch 'jenkins-pipeline'
      }
      steps {
        sh 'npm run dev'
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
    stage('Deploy for production') {
      when {
        branch 'main'
      }
      steps {
        sh 'npm start'
      }
    }
  }
}
