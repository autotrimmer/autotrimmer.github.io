// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><li class="part-title">User Manual</li><li class="chapter-item expanded "><a href="introduction.html"><strong aria-hidden="true">1.</strong> Introduction</a></li><li class="chapter-item expanded "><a href="troubleshooting.html"><strong aria-hidden="true">2.</strong> Troubleshooting</a></li><li class="chapter-item expanded affix "><li class="part-title">Guides</li><li class="chapter-item expanded "><div><strong aria-hidden="true">3.</strong> Tutorials</div></li><li><ol class="section"><li class="chapter-item expanded "><a href="guides/tutorial1.html"><strong aria-hidden="true">3.1.</strong> Tutorial 1: Let&#39;s try out AutoTrimmer by extending the sample project</a></li><li class="chapter-item expanded "><a href="guides/tutorial2.html"><strong aria-hidden="true">3.2.</strong> Tutorial 2: Let&#39;s add some grass</a></li></ol></li><li class="chapter-item expanded "><div><strong aria-hidden="true">4.</strong> Guides</div></li><li><ol class="section"><li class="chapter-item expanded "><a href="guides/install.html"><strong aria-hidden="true">4.1.</strong> Install guide</a></li><li class="chapter-item expanded "><a href="guides/workflow.html"><strong aria-hidden="true">4.2.</strong> Workflow</a></li></ol></li><li class="chapter-item expanded "><li class="part-title">Recipes</li><li class="chapter-item expanded "><a href="recipes.html"><strong aria-hidden="true">5.</strong> Recipes</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="recipes/convex.html"><strong aria-hidden="true">5.1.</strong> Convex corners</a></li><li class="chapter-item expanded "><a href="recipes/concave.html"><strong aria-hidden="true">5.2.</strong> Concave corners</a></li><li class="chapter-item expanded "><a href="recipes/coping.html"><strong aria-hidden="true">5.3.</strong> Coping</a></li><li class="chapter-item expanded "><a href="recipes/molding.html"><strong aria-hidden="true">5.4.</strong> Molding</a></li><li class="chapter-item expanded "><a href="recipes/roofs.html"><strong aria-hidden="true">5.5.</strong> Roofs</a></li></ol></li><li class="chapter-item expanded "><li class="part-title">Reference</li><li class="chapter-item expanded "><a href="rulebook.html"><strong aria-hidden="true">6.</strong> Rulebook</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="rulebook/surface_config.html"><strong aria-hidden="true">6.1.</strong> Surface</a></li><li class="chapter-item expanded "><a href="rulebook/trim_config.html"><strong aria-hidden="true">6.2.</strong> Trim</a></li><li class="chapter-item expanded "><a href="rulebook/trim_corner_config.html"><strong aria-hidden="true">6.3.</strong> Trim corner</a></li><li class="chapter-item expanded "><a href="rulebook/trim_group_config.html"><strong aria-hidden="true">6.4.</strong> Trim group</a></li><li class="chapter-item expanded "><a href="rulebook/edge_rules.html"><strong aria-hidden="true">6.5.</strong> Edge rule</a></li></ol></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0].split("?")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
