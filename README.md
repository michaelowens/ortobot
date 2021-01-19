# ortoBot

This repository contains the code for ortoBot (a Twitch chatbot) and the accompanying web interface.

## Deploying with dokku

If you haven't yet, start by cloning this repository. Alternatively, you can also download a zip of this repository at the top right of this GitHub page.

```
$ git clone https://github.com/michaelowens/ortobot.git
```

To deploy with dokku we're going to need 2 apps. By default this monorepo has the apps configured with the names:

- `ortobot` for the chatbot
- `ortobot-web` for the web interface

We will use those throughout this guide, but feel free to use different names. If you want to change the app names, make sure to edit `.dokku-monorepo` to reflect the new names.

### Installing required dokku plugins

_From this point on, all commands should be run on the **server** until mentioned otherwise!_

It is recommended to use the following plugins:

```sh
$ sudo dokku plugin:install https://github.com/dokku/dokku-redis.git redis
$ sudo dokku plugin:install https://gitlab.com/notpushkin/dokku-monorepo
$ sudo dokku plugin:install https://github.com/dokku/dokku-letsencrypt.git
```

Before we can create our database we need to pull a newer version of the `redis` docker image. As of writing this documentation, `dokku-redis` defaults to version 5.0.7. For this project, version 6.0.0 or higher is required.

```sh
$ docker pull redis
```

This should fetch the `latest` tag of the image.

### Creating the database and dokku apps

Let's start by creating the database, making sure we use the `latest` tag we just pulled from docker:

```sh
$ dokku redis:create ortobotdb -I latest
```

Now we can create 2 apps, one for the chatbot and the other for the web interface:

```sh
$ dokku create ortobot
$ dokku create ortobot-web
```

Both apps will need access to the database, which you can achieve by linking the database to the dokku apps.

```sh
$ dokku redis:link ortobotdb ortobot
$ dokku redis:link ortobotdb ortobot-web
```

### Connecting the repository to dokku

_From this point on, all commands should be run on your **local computer** until mentioned otherwise!_

Dokku has created 2 git repositories to which we can deploy our applications. We will need to add those to our repository.

```sh
$ git remote add bot dokku@example.com:ortobot
$ git remote add web dokku@example.com:ortobot-web
```

The repository is now ready to deploy! Each of these can take a little while.

```sh
$ git push bot
$ git push web
```

### Setting up a Twitch application

The bot and web interface should now be deployed, but they won't work yet. We will need to tell the dokku apps which twitch credentials to use.
To be able to use Twitch for authentication on the web interface you'll need to create an Application.

Go to the [Twitch Developer Console](https://dev.twitch.tv/console) and click the **Register Your Application**-button.

Follow the steps required to create your app. Most importantly, set the **Category** to `Website Integration` and add `https://ortobot-web.example.com/api/auth/twitch/callback` as an OAuth Redirect URL. `ortobot-web` is the name of your dokku application, but you can change the domain in dokku if you wish to do so.

Some notes that may be useful:

- The **name** will be seen when you log in with Twitch. It is recommended to use a clear name to indicate it is the control panel of your bot, e.g. _MyBot Control Panel_.
- An OAuth Redirect URL is where you will be redirected after logging in with your Twitch account. If you are going to work on the bot from your local machine you can add the following URL (alongside the already added URL):
  `http://localhost:8080/api/auth/twitch/callback`

After creating the application, make a note of the _OAuth Redirect URL_, _Client ID_, and the _Client Secret_ as you will be needing them in a later step.

### Getting an OAuth key for the bot

To connect with Twitch chat through IRC we need an OAuth key. The easiest way to do this (for now) is by logging in with your bot account on Twitch, go to [Twitch Chat OAuth Password Generator](https://twitchapps.com/tmi/), click connect and write down the OAuth token.

### Configuring the dokku apps

_From this point on, all commands should be run on the **server** until mentioned otherwise!_

Now that we have all the necessary credentials, we can add them as environmental variables to the dokku apps. Be sure to enter all your information from the previous steps.

```sh
$ dokku config:set ortobot TWITCH_USERNAME=<username> TWITCH_OAUTH=oauth:<oauth_token> TWITCH_CHANNEL=<channel>
$ dokku config:set ortobot-web TWITCH_CLIENT_ID=<twitch_app_client_id> TWITCH_CLIENT_SECRET=<twitch_app_client_secret> TWITCH_CALLBACK=https://ortobot-web.example.com/api/auth/twitch/callback JWT_SECRET=changemetoasecretkey
```

Lastly, we will need to add an SSL certificate. If you want to change the domain of your web interface, make sure to do this before this step as Let's Encrypt is subject to rate limiting. You can only request a limited amount of certificates per week.

**Note: By doing this you will agree to the Let's Encrypt Subscriber Agreement automatically.**

```sh
$ dokku config:set --global DOKKU_LETSENCRYPT_EMAIL=your@email.tld
$ dokku letsencrypt ortobot-web
```

It is a good idea to add a cronjob to automatically renew the certificate.

```sh
$ dokku letsencrypt:cron-job --add
```

Both your bot and web interface should now be fully functional!
