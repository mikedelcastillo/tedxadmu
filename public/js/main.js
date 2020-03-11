(function($){
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    
    gtag('config', 'UA-113151654-2');
    
    let scroll = 0;
    let $window = $(window);
    let $body;
    let $loading;
    let $frameWrapper;
    let $frame;
    let $frameClose;
    
    let scrollHandler = e => {
      scroll = $content.get(0).getBoundingClientRect().top * -1;
      if(scroll < 50) $header.removeClass("compact");
      else $header.addClass("compact");
    
      let x = window.innerWidth/2;
      let y = scroll + window.innerHeight / 2;
      let value = `${x}px ${y}px`;
    
      $content.css("-webkit-perspective-origin", value);
      $content.css("-moz-perspective-origin", value);
      $content.css("-ms-perspective-origin", value);
      $content.css("-o-perspective-origin", value);
      $content.css("perspective-origin", value);
    };
    
    $(document).ready(e => {
      //sidebar code
      SIDEBAR_CLASS = "sidebar-open";
      $header = $("#header-wrapper");
      $body = $(document.body);
      $content = $("#content-wrapper");
      $loading = $("#loading-wrapper");
    
      $frameWrapper = $("#frame-wrapper");
      $frame = $("#frame");
      $frameClose = $("#frame-close");
    
      $all = $([document.querySelector("html"), document.body, window]);
    
      let sidebarToggle = e => {
        if($body.hasClass(SIDEBAR_CLASS)) sidebarClose();
        else sidebarOpen();
      }
    
      let sidebarOpen = () => {
        $body.addClass(SIDEBAR_CLASS);
        setTimeout(() => {
          $("#header-wrapper, #content-wrapper").one("click", sidebarClose);
        }, 1);
      };
    
      let sidebarClose = () => {
        $body.removeClass(SIDEBAR_CLASS);
        $("#header-wrapper, #content-wrapper").off("click", sidebarClose);
      };
    
      $("#btn-hamburger").on("click", sidebarToggle.bind(window));
    
      $all.on("scroll", scrollHandler);
      $window.resize(scrollHandler);
      scrollHandler();
    
      if($moreBtn = $("#btn-more-text")){
        $moreText = $("#more-text");
    
        $moreBtn.on("mousedown", e => {
          height = $header.get(0).getBoundingClientRect().height
          target = $moreText.get(0).getBoundingClientRect().top + scroll - height - 16 * 1.5;
    
          $({value: scroll}).animate({
            value: target
          }, {
            duration: 1000,
            step: function(value){
              document.body.scrollTop = value;
              scrollHandler();
            }
          });
        });
      }
    
      if($buttons = $("a.btn-frame")){
        $buttons.each((i, element) => {
          $button = $(element);
    
          $button.on("click", e => {
            let href = e.target.getAttribute("href");
            showFrame(href);
            e.preventDefault();
          });
        });
      }
    
      $frameClose.on("click", hideFrame);
    });
    
    function showFrame(href){
      $frame.attr("src", href)
      $frameWrapper.fadeIn();
    }
    
    function hideFrame(){
      $frameWrapper.fadeOut();
    }
    
    $window.on("load", e => {
      setTimeout(() => {
        $content.removeClass("no-perspective");
    
        $body.removeClass("loading");
        $loading.fadeOut(200);
      }, 200);
    
    });
    })(jQuery);
    