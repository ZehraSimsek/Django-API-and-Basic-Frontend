from django.urls import path
from my_app_api.views import StaticJSONView

urlpatterns = [
    path('staticjson/', StaticJSONView.as_view(), name='staticjson'),
]
