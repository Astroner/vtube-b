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
          - [Pagination](#pagination)
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
Basically this project is just a wrapper over ytdl-core lib and youtube parser.
We directly fetch HTML from *youtube.com* and *music.youtube.com* and then parse it.

#### Personalization
These services identify users and their preferences with specific cookies:
 - __Secure-3PSID - actual user ID, stored in DB.
 - PREF - content preferences. Looks like 'PREF=key1=value1&key2=value2&key3=value3;'. Keys:
   - hl - content language. 'PREF=hl=en' for example

#### Parser details
##### Youtube
Youtube uses some kind of SSR strategy, they add initial page data to some variables, in most cases it is **ytInitialData**. 
To extract this data from AxiosResponse we use **extractDataFromResponse()** rx-js operator.

###### Pagination
Obviously, Youtube wont give you all the info at once, they use tricky pagination to optimize server load.
Initial data could be fetched with basic get request to specific page, channel videos for example *youtube.com/channel/ID/videos/*.
With **extractDataFromResponse()** operator we can extract actual data, but we will get only around 30 videos.
To get next page of videos you need to make "continuation" request with specific token.
Basically, continuation request is just a post request to *https://www.youtube.com/youtubei/v1/browse* with specific payload:
```ts
type Payload = {
   continuation: string;
   context: {
      client: {
         hl?: string,
         clientName: "WEB",
         clientVersion: "2.20230120.00.00",
      }
   }
}
```
Here in **context.client.hl** you can specify locale ("en" for example) but all other fields in **context.client** are required and should be like it's described in type.
The only problem here is **continuation** field. Well, usually, if you fetch something that can be continued, the last item will be **continuationItemRenderer**, which contains **continuationCommand.token** which is the **continuation** field.

##### Youtube Music
Youtube Music uses different kind of SSR, and it is kinda tricky. 
At first we need to find something like "initialData.push({path, params, data})", for example:
```ts
const example = "initialData.push({path: '\/search', params: JSON.parse('\x7b\x22query\x22:\x22overdrive\x22\x7d'), data: '${DATA}'"
```
Here, we need to extract DATA and **String.prototype.match()** with specific regexp can help us.
Basically, regexp for previous example looks like this:
```ts
const regexp = /search', params: (.+), data: (.+);ytcfg/gm
```
Then we do some transformations:
```ts
const htmlString = await fetchHTML();
const match = htmlString.match(regexp);
if (!match || !match[0]) return null;
const [text] = match;
const json = "" + text.slice(text.indexOf("data:") + 7, -9);
```
Here **json** variable stores actual data, but "surprise" its encoded in UTF-16, so we have to translate it to UTF-8.
Node.js doesn't have any built in tools nor external packages for this operation, so we have to do it on ourselves.

```ts
const data = json
   .replace(/\\x(\d|\w)(\d|\w)/gm, (entry) => {
         return String.fromCharCode(
            parseInt(entry.slice(2), 16)
         );
   })
   .replace(/\\+/gm, () => "\\");
```

Also you have to provide **User-Agent** header in request. For example:
```ts
const headers = {
   "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36"
}
```
because without it YTM will not respond with data.