node {
  env.NODEJS_HOME = "${tool 'Node'}"
  env.PATH="${env.NODEJS_HOME}/bin:${env.PATH}"
  sh 'node -v'
  stage('SCM') {
    checkout scm
  }
  stage('SonarQube Analysis') {
    def scannerHome = tool 'SonarScanner';
    withSonarQubeEnv() {
      sh "${scannerHome}/bin/sonar-scanner"
    }
  }
}
