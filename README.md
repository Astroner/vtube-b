# Hi there

# Table of content
 - [Development Mode](#development-mode)
 - [Deploy](#deploy)
 - [Envs](#envs)
 - [Useful Decorators](#useful-decorators)
 - [Hints and core principals](#hints-and-core-principals)
    - [Personalization](#personalization)
    - [Parser details](#parser-details)
       - [Youtube](#youtube)
       - [Youtube Music](#youtube-music)


# Development Mode
> yarn start:dev

# Deploy
> yarn build
> yarn start

# Envs
 - PORT
 - MONGO_URL - mongoDB connection url
 - JWT_SECRET
 - JWT_EXPIRES_IN

# Useful Decorators
 - @Protected() - route decorator. Ensures that user is logged in.
 - @UserData() - param decorator. If route uses @Protected() then this decorator will provide user data.

# Hints and core principals
Basically this project is just a wrapper over ytdl-code lib and youtube parser.
We directly fetch HTML from *youtube.com* and *music.youtube.com* and then parse it.

#### Personalization
These services identify users and their preferences with specific cookies:
 - __Secure-3PSID - actual user ID, stored in DB.
 - PREF - content preferences. Looks like 'PREF=key1=value1&key2=value2&key3=value3;'. Keys:
   - hl - content language. 'PREF=hl=en' for example

#### Parser details
##### Youtube
Youtube uses some kind of SSR strategy, they add initial page data to some variables, in most cases it is **ytInitialData**. 
To extract this data we use **extractDataFromResponse()** rx-js operator.

##### Youtube Music
Same as Youtube, Music uses the same kind of SSR, but it is kinda tricky, because YTM uses UTF-16 encoding, so at first we have to transform UTF-16 to UTF-8. 