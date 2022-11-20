import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';

export class CdkTestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'Vpc');

    const rdsCredentials: rds.Credentials =  rds.Credentials.fromGeneratedSecret("gorm");
    const postgres = new rds.DatabaseInstance(this, 'Postgres', {
        engine: rds.DatabaseInstanceEngine.postgres({
          version: rds.PostgresEngineVersion.VER_14_2, // バージョン指定
        }),
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MICRO),
        vpc:vpc,
        vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
        databaseName: "dbName",
        credentials: rdsCredentials
    })

    postgres.connections.allowFromAnyIpv4(ec2.Port.tcp(5432))
  }
}
