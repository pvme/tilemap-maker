$(function() {

    var $tileX = $("#tileX")
      , $tileY = $("#tileY")
      , $mapSize = $("#mapSize")
      , $mapSquaresWrapper = $(".map-squares-wrapper")
      , $mapSquares = $(".map-squares")
      , $mapSquaresBorders = $(".map-squares-borders")
      
      , $hoverTile = $(".hoverTile")
      , $tilePlayer = $('.hoverTile-player')
      , $tileCannon = $('.hoverTile-cannon')
      , $tileEnemy = $('.hoverTile-enemy')
      , $tileOther = $('.hoverTile-other')

    $("form").on("submit", function (e){
        e.preventDefault()
    })

    $("#legend").on('change', function () {

        if (this.value == "none") {
            $(".legend").hide()
            $('body').addClass("legend-off")
        } else {
            $(".legend").attr("src", "assets/" + [this.value] + ".png").show()
            $('body').removeClass("legend-off")
        }

        $hoverTile.hide()
        if (this.value.includes('player')) $tilePlayer.show()
        if (this.value.includes('cannon')) $tileCannon.show()
        if (this.value.includes('enemy')) $tileEnemy.show()
        if (this.value.includes('other')) $tileOther.show()

    })


    // When form changes
    $(".tileChangeInput").on('keyup, change', function (){
        var mejMapX = parseInt($tileX.val())
          , mejMapY = parseInt($tileY.val())
          , mapWidthInTiles = parseInt($mapSize.val())
          , mapX = mejMapX * 4 + 1
          , mapY = (200 - mejMapY) * 4 - 5
          , imgWidth = 256

        switch (mapWidthInTiles) {
            case 1:
                imgWidth = 512;
                break;
            case 2:
                imgWidth = 256;
                break;
            case 3:
                imgWidth = 128;
                break;
        }

        var trimmedWidth = mapWidthInTiles * imgWidth
          , untrimmedWidth = (mapWidthInTiles + 2) * imgWidth

        $mapSquares.width(untrimmedWidth + "px").height(untrimmedWidth + "px")
        $mapSquares.children('img').remove()
        $mapSquaresBorders.children('.map-square-border').remove()
        $mapSquares.css('left',"-" + imgWidth + "px").css('top',"-" + imgWidth + "px")
        
        // Build rows
        for (let y = 0; y < mapWidthInTiles + 2; y++) {
            // Build cols
            for (let x = 0; x < mapWidthInTiles + 2; x++) {
                var tileUrl = "https://runeapps.org/s3/map4/live/topdown-0/5/" + (mapX+x) + "-" + (mapY+y) + ".webp" //https://runeapps.org/s3/map4/live/topdown-{mej_plane}/5/{x}-{y}.webp
                
                //Convert map tile to base64
                toDataUrl(tileUrl, function(data64) {
                    var $img = $("<img></img>").attr('src', data64).width(imgWidth)
                    var $imgBorder = $("<div class='map-square-border'></div>").width(imgWidth).height(imgWidth)
                    $mapSquares.append($img)
                    $mapSquaresBorders.append($imgBorder)
                })
            }
        }

        $mapSquares.css("top", $mapSquares.css("top"))
        $mapSquares.css("left", $mapSquares.css("left"))
        
        $('body').removeClass("map-size-1 map-size-2 map-size-3")
        $('body').addClass("map-size-" + mapWidthInTiles)

        $mapSquares.draggable({ grid: [ 5, 5 ] })
        $hoverTile.draggable({ grid: [ 1, 1 ] }, { containment: ".map-squares-wrapper", scroll: false })
    })

    $("#mapSize").trigger('change')

    $("#gridlinesOnOff").on('change', function () {
        $('body').toggleClass("grid-on")
    })

    $("#tilesOnOff").on('change', function () {
        $('body').toggleClass("tiles-on")
    })

    // create & download
    $("#create-map").show().on('click', async function () {

        var $btn = $(this)
        $btn.prop('disabled', (i, v) => !v)
        $btn.children('.toggle').toggleClass('visually-hidden')

        modernScreenshot.domToPng(document.querySelector('#map')).then(dataUrl => {
            const link = document.createElement('a')
            link.download = 'map.png'
            link.href = dataUrl
            link.click()
            $btn.prop('disabled', (i, v) => !v)
            $btn.children('.toggle').toggleClass('visually-hidden')
        })
    })
})

function toDataUrl(url, callback) {
    var xhr = new XMLHttpRequest()
    xhr.onload = function() {
        var reader = new FileReader()
        reader.onloadend = function() {
            callback(reader.result)
        }
        reader.readAsDataURL(xhr.response)
    }
    xhr.open('GET', url)
    xhr.responseType = 'blob'
    xhr.send()
}
