# Generated by Django 5.1.2 on 2024-10-29 07:45

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_medicationhistory_delete_records'),
    ]

    operations = [
        migrations.RenameField(
            model_name='medicationhistory',
            old_name='dosage_form',
            new_name='dosage',
        ),
    ]
