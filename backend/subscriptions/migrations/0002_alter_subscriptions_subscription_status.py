# Generated by Django 5.1.5 on 2025-02-27 14:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('subscriptions', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='subscriptions',
            name='subscription_status',
            field=models.CharField(choices=[('ACTIVE', 'Active'), ('INACTIVE', 'Inactive'), ('EXPIRED', 'Expired'), ('CANCELLED', 'Cancelled'), ('TRIAL', 'Trial')], default='TRIAL', max_length=10),
        ),
    ]
