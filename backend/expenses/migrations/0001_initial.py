# Generated by Django 5.1.5 on 2025-02-13 13:40

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('branches', '0001_initial'),
        ('business', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Expenses',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('description', models.TextField(blank=True, null=True)),
                ('expense_date', models.DateField()),
                ('payment_method', models.CharField(choices=[('Cash', 'Cash'), ('Telebirr', 'Telebirr'), ('Bank Transfer', 'Bank Transfer'), ('Credit', 'Credit')], max_length=20)),
                ('receipt_number', models.CharField(blank=True, max_length=50, null=True)),
                ('recurring_frequency', models.CharField(blank=True, choices=[('daily', 'Daily'), ('weekly', 'Weekly'), ('monthly', 'Monthly'), ('quarterly', 'Quarterly'), ('yearly', 'Yearly')], max_length=20, null=True)),
                ('recurring_end_date', models.DateField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('business', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='business.business')),
                ('business_branch', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='branches.branches')),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'indexes': [models.Index(fields=['expense_date', 'amount'], name='idx_expense_date_amount'), models.Index(fields=['recurring_frequency'], name='idx_recurring_frequency'), models.Index(fields=['business', 'business_branch', 'expense_date'], name='idx_expense_lookup')],
            },
        ),
    ]
