// Copyright (c) HashiCorp, Inc
// SPDX-License-Identifier: MPL-2.0
import { Construct } from "constructs";
import { App, TerraformStack } from "cdktf";
import * as google from '@cdktf/provider-google';

const project = 'laughing-garbanzo';
const region = 'us-central1';
const repository = 'laughing-garbanzo';

class MyStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new google.provider.GoogleProvider(this, 'google', {
      project,
      region,
    });

    new google.artifactRegistryRepository.ArtifactRegistryRepository(this, 'registry', {
      format: 'docker',
      location: region,
      repositoryId: 'registry',
    });

    new google.cloudbuildTrigger.CloudbuildTrigger(this, 'trigger', {
      filename: 'cloudbuild.yaml',
      github: {
        owner: 'hsmtkk',
        name: repository,
        push: {
          branch: 'main',
        },
      },
    });

    const rails = new google.cloudRunService.CloudRunService(this, 'rails', {
      autogenerateRevisionName: true,
      location: region,
      name: 'rails',
      template: {
        spec: {
          containers: [{
            image: 'us-docker.pkg.dev/cloudrun/container/hello',
          }],
        },
      },
    });

    const noauth = new google.dataGoogleIamPolicy.DataGoogleIamPolicy(this, 'noauth', {
      binding: [{
        members: ['allUsers'],
        role: 'roles/run.invoker',
      }],
    });

    new google.cloudRunServiceIamPolicy.CloudRunServiceIamPolicy(this, 'noauth-policy', {
      location: region,
      policyData: noauth.policyData,
      service: rails.name,
    });

  }
}

const app = new App();
new MyStack(app, "cdktf");
app.synth();
