[source](https://github.com/jcpst/jcpst)

Ok, so in way too much detail, here's how I came to the tooling used to build this site.

For a long time, I used [harp][harp]. It's super simple to set up, flexible, and has a lot of features. However, it has a lot of stuff I don't need. Updates were slow; I would frequently need to use an older version of node to build my page. It has dependencies that use native code. None of this stuff is that bad, but it was enough to give me an excuse to play around with other options.

After I ditched harp, I looked into some of the batteries-included SPA frameworks that have static build options. I tried [next][next]. I tried [sapper][sapper] because I love the concept of [svelte][svelte]. I tried [nuxt][nuxt], which I liked developing in more. But all of them split out a bunch of JS blobs when you compiled them to static sites, so I moved on. I briefly considered writing a similar tool in [hyperapp][hyperapp], which is a my favorite SPA-build tool, but that seemed excessive for a static site. Eventually I ruled out the idea of building a static site from a SPA framework.

As my personal landing page, I wanted this to be as accessable as possible. I like the idea of building web pages and applications that are usable parts of the world with poor internet service and old hardware.

For CSS, [min.css][min] was good for a while. I tried [tacit][tacit] too. I find it very appealing, but not flexible enough for what I wanted to do. I handrolled my css for a while, but that became tedious when I started reimplementing solved problems. I finally landed on [w3.css][w3.css], which I think has the right combination of flexibility, simplicity and library size for most stuff I build.

I looked into some of the big static site generators. Hugo, Jekll, meh. Just wasn't interested.

So I started implementing just the parts of harp.js that I like: Just wrting pug and markdown files that live in a tree of directories, and compiling them to HTML. I then added [purify-css][purify-css] to only deploy the CSS I was using. I'm pretty happy with the result.

[harp]: http://harpjs.com/
[min]: http://mincss.com/
[tacit]: https://github.com/yegor256/tacit
[w3.css]: https://www.w3schools.com/w3css/
[next]: https://github.com/zeit/next.js
[sapper]: https://github.com/sveltejs/sapper
[svelte]: https://svelte.technology/
[nuxt]: https://github.com/nuxt/nuxt.js
[hyperapp]: https://hyperapp.js.org/
[purify-css]: https://github.com/purifycss/purifycss