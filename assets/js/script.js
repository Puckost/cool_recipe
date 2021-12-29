$(document).ready(function() {

    const baseUrl = 'http://localhost:3000/';

    const urlSearchParams = new URLSearchParams(window.location.search);
    let allParams = Object.fromEntries(urlSearchParams.entries());

    // Create recipe
    $("#add_recipe").submit(function(event) {
         event.preventDefault();

        var data = new FormData($(this)[0]);

        $.ajax({
            url : `${baseUrl}api/recipes`,
            type : "POST",
            data : data,
            processData: false,
            contentType: false,
            cache : false,
            success : function(data) {
                if(data._id !== undefined) {
                    toastr.success('You have successfuly created recipe', 'Recipe created', {
                        timeOut: 3000,
                        preventDuplicates: true,
                        positionClass: 'toast-top-center',
                        // Redirect
                        onHidden: function() {
                            window.location.href = '/';
                        }
                    })
                }
            }
        });
    })

    // Update recipe
    $("#update_recipe").submit(function(event) {
        event.preventDefault();

        var data = new FormData($(this)[0]);
        var id = $(this).find('[name="id"]').val();

        $.ajax({
            url : `${baseUrl}api/recipes/${id}`,
            type : "PUT",
            data : data,
            processData: false,
            contentType: false,
            cache : false,
            success : function(data) {
                if(data._id !== undefined) {
                    toastr.success('You have successfuly updated recipe', 'Recipe updated', {
                        timeOut: 3000,
                        preventDuplicates: true,
                        positionClass: 'toast-top-center',
                        // Redirect
                        onHidden: function() {
                            window.location.href = '/';
                        }
                    })
                }
            }
        });
    })

    // Delete recipe
    $(document).on('click', '.recipe a.delete', function() {
        let id = $(this).attr("data-id");

        let request = {
            "url" : `${baseUrl}api/recipes/${id}`,
            "method" : "DELETE"
        }

        if(confirm("Do you really want to delete this record?")) {
            $.ajax(request).done(function(response){
                location.reload();
            })
        }
    });

    // Image preview for upload image
    $(document).on('change', '.browse-image-preview input[type="file"]', function() {
        const [file] = this.files;
        if (file) {
            $('.browse-image-preview .image-preview img').attr('src', URL.createObjectURL(file));
        }
    });

    // Ingrediens add one
    $(document).on('click', '.ingrediens-container > a', function(e) {
        e.preventDefault();
        let parent = $(this).closest('.ingrediens-container');
        let cloned = parent.find('.ingredient-row-copy > div').clone();
        parent.find('.append-here').append(cloned);
    });

    // Ingredient remove
    $(document).on('click', '.ingrediens-container button', function(){
        let parent = $(this).closest('div');
        parent.remove();
    });

    // Search recipes
    $(document).on('click', '.search-form ul li a', function(e) {
        e.preventDefault();
        delete allParams.title;
        delete allParams.ingredient;
        delete allParams.frase;
        delete allParams.page;
        let parent = $(this).closest('form');
        let frase = parent.find('input').val();
        allParams.frase = frase;

        let params = $(this).data('params').split(',');

        jQuery.each(params, function(i, e) {
            allParams[e] = frase;
        });
        let par = constructUrlParams();
        window.location.replace(baseUrl + par);
    });

    // Filter sort
    $(document).on('click', '.search-filter-sort li a', function(e) {
        e.preventDefault();
        delete allParams.page;
        let params = $(this).data('params').split('&');
        console.log(params);
        $.each(params, function(i, v) {
            let split = v.split('=');
            allParams[split[0]] = split[1];
        });
        let par = constructUrlParams();
        console.log(baseUrl + par);
        window.location.replace(baseUrl + par);
    });

    // Constructs get query for url
    function constructUrlParams()
    {
        let url = '?';
        $.each(allParams, function(i, v) {
            url += `${i}=${v}&`;
        });
        return url;
    }

})
