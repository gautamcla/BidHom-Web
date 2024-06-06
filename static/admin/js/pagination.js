
function getAllPageLinks(listing_type,currPage,perpage,counts,search,sort_key,sort_val) {

        var $output = '';
        if(currPage=='' || currPage<1) currPage = 1;
        if(perpage != 0)
           var $pages  = Math.ceil(counts/perpage);


        if($pages>1) {
            if(currPage == 1){
                $output = $output + '<li class="page-item disabled"><a class="page-link" href="#">Previous</a></li>';
            }else{
                $output = $output + '<li class="page-item"><a class="page-link" href="javascript:void(0)" onclick="getresult(\''+listing_type+'\',\''+(parseInt(currPage)-1)+'\',\''+search+'\',\''+sort_key+'\',\''+sort_val+'\')">Previous</a></li>';
            }



            if((currPage-3)>0) {

                if(currPage == 1){
                    $output = $output + '<li class="page-item active"><a class="page-link" href="#">1</a></li>';
                }else{

                    $output = $output + '<li class="page-item"><a class="page-link" href="javascript:void(0)" onclick="getresult(\''+listing_type+'\',1,\''+search+'\',\''+sort_key+'\',\''+sort_val+'\')">1</a></li>';
                }

            }
            if((currPage-3)>1) {
                    $output = $output + '<li class="page-item"><a class="page-link" href="javascript:void(0)">...</a></li>';
            }

            for(var $i=(currPage-2); $i<=(currPage+2); $i++)    {

                if($i<1){continue; }
                if($i>$pages){ break; }
                if(currPage == $i){
                    $output = $output + '<li id="'+$i+'" class="page-item active"><a class="page-link" href="javascript:void(0)">'+$i+'</a></li>';
                }else{
                    $output = $output + '<li class="page-item"><a class="page-link" href="javascript:void(0)" onclick="getresult(\''+listing_type+'\',' + $i + ',\''+search+'\',\''+sort_key+'\',\''+sort_val+'\')">'+$i+'</a></li>';
                }

            }

            if(($pages-(currPage+2))>1) {
                $output = $output + '<li class="page-item"><a class="page-link" href="javascript:void(0)">...</a></li>';
            }
            if(($pages-(currPage+2))>0) {
                if(currPage == $pages){
                    $output = $output + '<li id="'+$pages+'" class="page-item active"><a class="page-link" href="javascript:void(0)">'+$pages+'</a></li>';
                }
                else{
                    $output = $output + '<li class="page-item"><a class="page-link" href="javascript:void(0)" onclick="getresult(\''+listing_type+'\','+($pages)+',\''+search+'\',\''+sort_key+'\',\''+sort_val+'\')">' +  ($pages) +'</a></li>';
                }
            }

            if(currPage < $pages){
                $output = $output + '<li class="page-item"><a class="page-link" href="javascript:void(0)" onclick="getresult(\''+listing_type+'\','+ (currPage+1) +',\''+search+'\',\''+sort_key+'\',\''+sort_val+'\')">Next</a></li>';
            }
            else{
                $output = $output + '<li class="page-item disabled"><a class="page-link" href="#">Next</a></li>';
            }


        }
        return $output;
    }
    function getPrevNext(currPage,counts,listing_type_id,sort_key='',sort_val='') {

        var $output = '';
        if(currPage=='' || currPage<1) currPage = 1;
        if(perpage != 0){
            var $pages  = Math.ceil(counts/perpage);
        }
        if($pages>1) {
            if(currPage == 1){
                $output = $output + '<li class="page-item disabled"><a class="page-link" href="#">Previous</a></li>';
            }
            else{
                $output = $output + '<li class="page-item"><a class="page-link" href="javascript:void(0)" onclick="getresult(\''+listing_type+'\','+ (currPage-1) +',\''+search+'\',\''+sort_key+'\',\''+sort_val+'\')">Previous</a></li>';
            }
            console.log(currPage);
            console.log($pages);
            if(currPage < $pages){
                $output = $output + '<li class="page-item"><a class="page-link" href="javascript:void(0)" onclick="getresult(\''+listing_type+'\','+ (currPage+1) +',\''+search+'\',\''+sort_key+'\',\''+sort_val+'\')">Next</a></li>';
            }
            else{
                $output = $output = '<li class="page-item disabled"><a class="page-link" href="#">Next</a></li>';
            }


        }
        return $output;
    }