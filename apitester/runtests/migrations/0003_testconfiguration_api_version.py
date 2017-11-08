# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2017-11-08 08:42
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('runtests', '0002_testconfiguration_consumer_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='testconfiguration',
            name='api_version',
            field=models.CharField(default='3.0.0', help_text='Version of the API to test, e.g. 3.0.0', max_length=255, verbose_name='API Version'),
            preserve_default=False,
        ),
    ]
