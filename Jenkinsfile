pipeline {
  agent any
  environment {
    // Set environment variables needed for deployment
    NODE_ENV = 'production'
    APP_NAME = 'my-node-app'
    GIT_REPO = 'https://github.com/my-username/my-node-app.git'
  }
  stages {
    stage('Checkout') {
      steps {
        // Checkout source code from Git repository
        checkout([$class: 'GitSCM', branches: [[name: '*/master']], userRemoteConfigs: [[url: env.GIT_REPO]]])
      }
    }
    stage('Install dependencies') {
      steps {
        // Install Node.js dependencies
        sh 'npm install'
      }
    }
    stage('Build') {
      steps {
        // Build the application
        sh 'npm run build'
      }
    }
    stage('Deploy') {
      steps {
        // Use pm2 to start or restart the Node.js server
        sh 'npm install -g pm2'
        sh 'pm2 delete $APP_NAME || true'
        sh 'pm2 start build/server.js --name $APP_NAME'
      }
    }
  }
}
