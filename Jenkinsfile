node {
  env.NODEJS_HOME = "${tool 'Node'}"
  env.PATH="${env.NODEJS_HOME}/bin:${env.PATH}"
  stage('SCM') {
    checkout scm
  }
  stage('Install dependencies') {
    sh "npm install"
    sh "cd client && npm install"
  }
  stage('Test and coverage') {
    sh "CI=true npm test"
  }
  stage('SonarQube scan') {
    def scannerHome = tool 'SonarScanner';
    withSonarQubeEnv() {
      sh "${scannerHome}/bin/sonar-scanner"
    }
  }
}
