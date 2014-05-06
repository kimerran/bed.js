bed.js
======

Where do you REST?


sample usage
============

```javascript

    // will perform a GET to /blog/123
    bed.$g('/blog/:Id', { Id: 123 }, function (result) {
        
        // do something with result.content
        $("#body").html(result.content);

    });
    
    
    // maps to /article/read?Id=456
    bed.$g.articleRead({ Id: 456 }, function (result) {
        
         // do something with result.content
        $("#body").html(result.content);
    });


```


library goals
=============
1. simplicity
2. no external dependencies
3. REST as JavaScript functions
4. URL patterns
