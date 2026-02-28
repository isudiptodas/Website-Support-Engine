<h1>Cloud Native DevOps Architecture</h1>

<img height='800' src='https://github.com/isudiptodas/Cloud-Voting-System/blob/main/working.jpg' />

<h2>System Working</h2>
<ul>
  <li>Frontend deployed on vercel (Independent)</li>
  <li>Database hosted on cloud servers (Auto manage) </li>
  <li>Backend connects with jenkins webhook</li>
  <li>On each code push webhook triggers, test happens, builds image, pushed on docker hub</li>
  <li>Image updates and deployed on kubernetes cluster</li>
</ul>

<p><b>Tech Stack : </b> <i>ReactJS, NodeJS, ExpressJS, MongoDB, Redis, Docker, Kubernetes, Jenkins, AWS ELB, Prometheus, Grafana</i></p>

<h2>Architecture :</h2>
<ol>
  <li>Decoupled Frontend</li>
  <li>CI/CD with jenkins</li>
  <ul>
    <li>Docker base image optimization with layered caching</li>
    <li>Secure env with jenkins credential manager</li>
    <li>Conditional dependency installation (storage cache)</li>
    <li>Image scan for vulnerabilities and issues</li>
    <li>EKS image update rollout confirmation</li>
    <li>Auto rollback in case image updation fails</li>
    <li>Email alert post pipeline execution</li>
  </ul>
  <li>Kubernetes container orchestration with AWS EKS</li>
  <li>Load balancing using AWS ELB</li>
  <li>Application and cluster monitoring with prometheus and grafana</li>
</ol>

###

<h2>Production setup</h2>
<p><b>Requirements : AWS account, Docker Hub account</b></p>

***

<h2><b>STEP 1 : Jenkins nodes configure</b></h2>
<ol>
  <li>Create two EC2 instances (master, agent)</li>
  <li>On master : </li>
  <ul>
    <li>Install jdk latest</li>
    <li>Install jenkins</li>
    <li>Attach elastic IP (optional but recommended)</li>
    <li>Add inbound rule for port : 8080</li>
    <li>Copy IPv4 and open in new tab with :8080 -> http://ipv4-address:8080</li>
    <li>Create jenkins account</li>
    <li>Connect EC2 with local machine or use AWS terminal : </li>
    <ul>
      <li>navigate to <i>.ssh</i> folder </li>
      <li>run command : <i>ssh-keygen</i></li>
      <li>Store private key on safe place</li>
      <li>Copy public key (will use later)</li>
    </ul>
  </ul>

  <li>On agent : </li>
  <ul>
    <li>Install jdk latest</li>
    <li>Install docker, nodejs, npm, kubectl, aws cli</li>
    <li>Create a role for EC2 to communicate with EKS and attach the policy with agent EC2</li>
    <li>Navigate to <i>.ssh</i> folder > <i>authorized_keys</i> </li>
    <li>Paste master public key on authorized_keys</li>
    <li>Save and exit</li>
  </ul>
</ol>

<h2><b>STEP 2 : Connect agent node with jenkins master</b></h2>
<ol>
  <li>Copy agent node username (ubuntu)</li>
  <li>Copy private IP (if master and agent are within same VPC) otherwise allocate elastic IP for agent and copy IPv4</li>
  <li>In jenkins dashboard :</li>
  <ul>
    <li>Settings > credentials > add global credentials > type : ssh with username & private key</li>
    <li>Add username : ubuntu</li>
    <li>Add host : private IP</li>
    <li>Add secret/private key : master private key</li>
    <li>Save and exit</li>
  </ul>
  <li>Again on settings : </li>
  <ul>
    <li>Manage nodes</li>
    <li>Add a new agent/node</li>
    <li>Enter basic details</li>
    <li>Add authentication method and select from global credentials</li>
    <li>Save and exit</li>
  </ul>
  <li>Ready for jobs and pipeline 🎉</li>
</ol>

<h2><b>STEP 3 : Connect github webhook trigger</b></h2>
<ol>
  <li>Open github > repo you want to connect > repo settings</li>
  <li>Webhooks > add webhook</li>
  <li>url : http://ipv4-address:8080/github-webhook/ (IPv4 should not change that's why elastic IP is recommended)</li>
  <li>Content type : application/json</li>
  <li>SSL verification : disable</li>
  <li>Check event type</li>
  <li>Save and exit</li>
  <li>Done 🎉</li>
</ol>

<h2><b>STEP 4 : Webhook trigger jenkins pipeline</b></h2>
<ol>
  <li>dashboard > new item > pipeline</li>
  <li>Select git scm polling</li>
  <li>Add repo url, branch, pipeline file script path (Jenkinsfile)</li>
  <li>Add authentication method : username with password or (personal access tokens)</li>
  <li>Save and exit</li>
  <li>Pipeline connected 🎉</li>
</ol>

<h2><b>STEP 5 : AWS EKS Setup with nodegroups</b></h2>
<ol>
  <li>Create cluster in aws console with VPC settings and subnets (recommended : 3 subnets)</li>
  <li>Attach a role for EKS with EKSClusterPolicy </li>
  <li>Create one nodegroup with all the selected subnets</li>
  <li>Specs : atleast t3.small / t3.medium with 20GB storage and 1 node max. (for small deployments)</li>
  <li>Attach roles and policy to nodegroup : </li>
  <ul>
    <li>IAM > roles > select EC2</li>
    <li>Attach policy EC2WorkerNode, ContainerRegistry, CNI</li>
    <li>Save and exit</li>
  </ul>
  <li>Attach this role to the nodegroup</li>

  </ol>
  
  <h2><b>STEP 6 : Authenticate EC2 jenkins agent with EKS</b></h2>
  <ol>
  <li>On jenkins agent EC2 : </li>
  <ul>
    <li>Select IAM role and find ARN</li>
    <li>Copy ARN > navigate to EKS > cluster > select cluster > access</li>
    <li>Create a new principle access role and add the ARN</li>
    <li>Add policy of EKSClusterAdminPolicy</li>
    <li>Save and exit</li>
  </ul>
  <li>Now jenkins EC2 can make access to EKS cluster and run commands</li>
  <li>Create auto image update rollout in jenkins pipeline</li>
<li>Done 🎉</li>
  </ol>
