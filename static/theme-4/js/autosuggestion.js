$(document).ready(function(){
    $(document).on("click", function(e){
        try{
            closeAllSuggestions('autocomplete-items');
        }catch(ex){
            console.log(ex);
        }
    });
    $(document).on("click", '.suggestion_item', function(e) {
        var input = $(this).closest('.autocomplete-items').siblings('.sugesstion_input').attr('id');
        $('#'+input).val($(this).find('.suggestion_value').val());
        closeAllSuggestions('autocomplete-items');
    });
});
function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;

  var all_suggesstion = '';
  var a, b, i, val = $('#'+inp).val();
  closeAllSuggestions('autocomplete-items');
  if (!val) { return false;}
  currentFocus = -1;

  parent_div_id = $('#'+inp).attr('id')+'autocomplete-list';
  $('#'+inp).parent().append('<div class="autocomplete-items" id="'+parent_div_id+'"></div>');
  a = $('#'+parent_div_id);
  $.each(arr, function(i, item) {
    a.append('<div class="suggestion_item"><strong>'+item+'</strong><input type="hidden" class="suggestion_value" value="'+item+'"></div>');
  });

}

function closeAllSuggestions(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    $('.'+elmnt).remove();
    /*var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }*/
}
function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
}
function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
}