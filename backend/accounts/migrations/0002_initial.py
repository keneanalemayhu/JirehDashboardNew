# Generated by Django 5.1.5 on 2025-02-13 13:40

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('accounts', '0001_initial'),
        ('auth', '0012_alter_user_first_name_max_length'),
        ('branches', '0001_initial'),
        ('business', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='business',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='business.business'),
        ),
        migrations.AddField(
            model_name='customuser',
            name='business_branch',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='branches.branches'),
        ),
        migrations.AddField(
            model_name='customuser',
            name='groups',
            field=models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups'),
        ),
        migrations.AddField(
            model_name='customuser',
            name='user_permissions',
            field=models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions'),
        ),
        migrations.AddIndex(
            model_name='customuser',
            index=models.Index(fields=['phone', 'username'], name='idx_user_auth'),
        ),
        migrations.AddIndex(
            model_name='customuser',
            index=models.Index(fields=['business_branch', 'role'], name='idx_user_business_branch_role'),
        ),
        migrations.AddIndex(
            model_name='customuser',
            index=models.Index(fields=['business', 'is_active'], name='idx_user_business_status'),
        ),
        migrations.AddIndex(
            model_name='customuser',
            index=models.Index(fields=['business', 'business_branch', 'is_active'], name='idx_employee_lookup'),
        ),
        migrations.AddIndex(
            model_name='customuser',
            index=models.Index(fields=['phone', 'email'], name='idx_employee_contact'),
        ),
    ]
