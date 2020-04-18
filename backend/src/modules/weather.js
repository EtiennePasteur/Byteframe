class Weather {
  user;

  set user(user) {
    this.user = user
  }

  is_cloudy() {
    return false;
  }

  is_rainy() {
    return false;
  }

  is_partly_cloudy() {
    return false;
  }
}

module.exports = Weather;
