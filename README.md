# Image Server

---

This is a microservice with an API

---

## Requests

This api can be accessed at:

http://flip3.engr.oregonstate.edu:17778/getImage

An example of an api call with parameters:

http://flip3.engr.oregonstate.edu:17778/getImage?response_type=link&searchTerms=dog

This API will serve image links or image files, with the following functionality:

- Images can be random, or by search using keywords (search terms)
- Keyword search images can be resized

### Query Parameters

<table>

<tr>
<td style="font-family: 'Andale Mono',monospace">
response_type=
</td>
<td style="font-family: 'Andale Mono',monospace">
'random', 'link', or 'file'
</td>
<td style="font-family: 'Andale Mono',monospace">
string
</td>
</tr>

<tr>
<td style="font-family: 'Andale Mono',monospace">
width=
</td>
<td style="font-family: 'Andale Mono',monospace">
desired width in pixels
</td>
<td style="font-family: 'Andale Mono',monospace">
integer
</td>
</tr>

<tr>
<td style="font-family: 'Andale Mono',monospace">
response_type
</td>
<td style="font-family: 'Andale Mono',monospace">
desired height in pixels
</td>
<td style="font-family: 'Andale Mono',monospace">
integer
</td>
</tr>

</table>

---
## Responses

######*Overview*

Responses will either be an error, or:
- JSON-ized text of a link to an image file on Image Server,
- JSON-ized text of an outside link (to an image at it's original source), or
- An image file sent over HTTP, using sendFile

The link text responses can simply be JSON-parsed and inserted as source to an image
element, or downloaded with a simple GET request, and then used by the client.  
The file (sendFile) response be downloaded and saved or manipulated by the client.

######*More Detail*

### If there is an error:

JSON:
- `{ error: true, message: < description of error > }`

### If response_type = 'random':

- Response will be JSON of a string, which will be a link url to a random image.
This will be an outside link (not on Image Server).  
- The primary source will be a random search of the Flickr group 'Flickr Central'.  
Image Server may implement backup search methods (in case of failure), but this 
is not implemented at this
time.  
- If response_type is 'random', any other arguments (such as height or width)
will be ignored.
- Image links will be to jpeg images, extension .jpg
- Images will be approximately 1024 px on their longest dimension (height or width)

### For any other response_type:

- If there are searchTerms given in the request query:
  - A url to an original image will be randomly chosen from a Google API search
using the search terms
- If no search terms are given
  - A random image link will be obtained from Flickr as described in the previous section

- In either case, then:
  - The image will be downloaded to Image Server
  - The image will be resized to width / height given in url query 
(reducing to bring the image within both parameters if given)
  - If no url query measurements were given, the default will be 800 px for both
  - The image will only be reduced, not enlarged
- After image resizeCache, it will be saved as a new jpeg file ('.jpg')
- The link to this new file will be served to the client, either as JSON-ized text
to obtain the file on Image Server, or sent as a file with HTTP sendFile





