# Generated by Django 5.1.5 on 2025-02-13 13:40

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Business',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('address_street', models.TextField(default='Unkown')),
                ('address_city', models.TextField(default='Unkown')),
                ('address_country', models.TextField(default='Ethiopia')),
                ('contact_number', models.CharField(max_length=15)),
                ('registration_number', models.CharField(default='UnRegistered', max_length=100, unique=True)),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('admin', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='admin_businesses', to=settings.AUTH_USER_MODEL)),
                ('owner', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='owner_businesses', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'indexes': [models.Index(fields=['owner', 'is_active'], name='idx_business_owner'), models.Index(fields=['admin', 'is_active'], name='idx_business_admin')],
            },
        ),
    ]
