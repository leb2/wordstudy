from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

from wordstudy import views

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'wordstudy.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', views.index, name='index'),
    url(r'^fetch_words', views.fetch_words, name='fetch_words'),
    url(r'^send_metadata', views.send_metadata, name='send_metadata')
)
