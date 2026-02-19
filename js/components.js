(function () {
    var path = window.location.pathname;
    var base = path.replace(/\/[^/]*$/, '/') || '/';
    if (base.indexOf('/') !== 0 && base !== '') base = '/' + base;

    function fixNavHrefs(html, base) {
        if (!base || base === '/') return html;
        var prefix = base.replace(/\/$/, '');
        return html.replace(/href="([^"]+)"/g, function (_, href) {
            if (href.indexOf('http') === 0 || href.indexOf('#') === 0) return 'href="' + href + '"';
            return 'href="' + prefix + '/' + href + '"';
        });
    }

    function setActiveNav(container) {
        var page = path.split('/').pop() || 'index.html';
        if (page === '' || page === 'index.html') page = 'about';
        else page = page.replace(/\.html$/, '');
        var link = container.querySelector('a[data-page="' + page + '"]');
        if (link) link.classList.add('active');
    }

    function load(id, file, transform) {
        var el = document.getElementById(id);
        if (!el) return Promise.resolve();
        return fetch(base + file)
            .then(function (r) { return r.text(); })
            .then(function (html) {
                if (transform) html = transform(html);
                el.innerHTML = html;
                if (id === 'site-nav') setActiveNav(el);
            });
    }

    Promise.all([
        load('site-header', 'components/header.html'),
        load('site-nav', 'components/nav.html', function (html) { return fixNavHrefs(html, base); }),
        load('site-footer', 'components/footer.html')
    ]).catch(function () {
        document.body.innerHTML = '<p style="padding:2em;text-align:center;">Load components from a server (e.g. Live Server or GitHub Pages). File protocol may block fetch.</p>';
    });
})();