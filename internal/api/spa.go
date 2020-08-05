package api

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
)

type spaHandler struct {
	staticPath string
	indexPath  string
}

func (h *spaHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	path, err := filepath.Abs(r.URL.Path)
	if err != nil {
		handleError(err, w, 500)
		return
	}
	path = filepath.Join(h.staticPath, path)
	_, err = os.Stat(path)
	if os.IsNotExist(err) {
		fmt.Println(err)
		http.ServeFile(w, r, filepath.Join(h.staticPath, h.indexPath))
		return
	} else if err != nil {
		handleError(err, w, 500)
		return
	}
	http.FileServer(http.Dir(h.staticPath)).ServeHTTP(w, r)
}
