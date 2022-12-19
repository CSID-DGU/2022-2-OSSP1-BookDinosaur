def remote = [:]
remote.name = "ubuntu"
remote.host = "146.56.116.255"
remote.allowAnyHosts = true

node {
    withCredentials([sshUserPrivateKey(credentialsId: 'a46d799b-6bec-4b73-8b44-b15d3b92cbda', keyFileVariable: 'identity', passphraseVariable: '', usernameVariable: 'userName')]) {
        remote.user = userName
        remote.identityFile = identity
        stage("SSH Steps Rocks!") {
            sshCommand remote: remote, command: 'cd 2022-2-OSSP1-BookDinosaur-3'
            sshCommand remote: remote, command: 'sudo docker compose up --build'
        }
    }
}
